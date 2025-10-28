import os
import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
from flask import Flask, request, redirect, render_template, jsonify

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración desde variables de entorno
GMAIL_USER = os.environ.get('GMAIL_USER')
GMAIL_PASS = os.environ.get('GMAIL_PASS')
DESTINO = os.environ.get('DESTINO_EMAIL')

# Validar variables de entorno al iniciar
if not all([GMAIL_USER, GMAIL_PASS, DESTINO]):
    raise ValueError("Faltan variables de entorno necesarias en .env")

# Configuración de seguridad básica
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

@app.route('/')
def index():
    return render_template('adamus_capital.html')

def send_email_async(nombre, email, organizacion, tipo, mensaje):
    """Sends email in the background"""
    try:
        subject = 'New Inquiry from Adamus Capital'
        body = f"""New contact form submission:

Name: {nombre}
Email: {email}
Organization: {organizacion}
Inquiry Type: {tipo}
Message:
{mensaje}

---
This is an automated message. Please do not reply to this email.
"""
        msg = f"Subject: {subject}\nTo: {DESTINO}\nFrom: {GMAIL_USER}\n\n{body}"
        
        with smtplib.SMTP('smtp.gmail.com', 587, timeout=5) as server:
            server.set_debuglevel(0)
            server.starttls()
            server.login(GMAIL_USER, GMAIL_PASS)
            server.sendmail(GMAIL_USER, DESTINO, msg.encode('utf-8'))
    except Exception as e:
        # Log error could be implemented here
        pass

@app.route('/send', methods=['POST'])
def send():
    try:
        # Obtener datos del formulario
        full_name = request.form.get('fullName', '').strip()
        if full_name:
            nombre = full_name
        else:
            first_name = request.form.get('firstName', '').strip()
            last_name = request.form.get('lastName', '').strip()
            nombre = f"{first_name} {last_name}".strip()
        
        email = request.form.get('email', '').strip()
        organizacion = request.form.get('organization', '').strip()
        tipo = request.form.get('inquiryType', '').strip()
        mensaje = request.form.get('message', '').strip()

        # Iniciar el envío en segundo plano
        thread = threading.Thread(
            target=send_email_async,
            args=(nombre, email, organizacion, tipo, mensaje)
        )
        thread.start()
        
        # Redirigir de inmediato sin esperar a que termine el envío
        return redirect('/')
        
    except Exception as e:
        # Log error could be implemented here
        return "Ocurrió un error al procesar tu solicitud.", 500

if __name__ == '__main__':
    # Solo para desarrollo local
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        app.run(debug=False, host='0.0.0.0')
