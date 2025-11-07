import os
import smtplib
import threading
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
from flask import Flask, request, redirect, render_template, jsonify

# Configurar logging para producción
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración desde variables de entorno
GMAIL_USER = os.environ.get('GMAIL_USER')
GMAIL_PASS = os.environ.get('GMAIL_PASS')
DESTINO = os.environ.get('DESTINO_EMAIL')

# Validar variables de entorno al iniciar
if not all([GMAIL_USER, GMAIL_PASS, DESTINO]):
    logger.error("❌ ERROR: Faltan variables de entorno necesarias (.env)")
    logger.error(f"GMAIL_USER: {'✓' if GMAIL_USER else '✗'}")
    logger.error(f"GMAIL_PASS: {'✓' if GMAIL_PASS else '✗'}")
    logger.error(f"DESTINO_EMAIL: {'✓' if DESTINO else '✗'}")
    raise ValueError("Faltan variables de entorno necesarias en .env")

logger.info("✓ Variables de entorno cargadas correctamente")
logger.info(f"✓ Servidor de email configurado: {GMAIL_USER}")
logger.info(f"✓ Email destino: {DESTINO}")

# Configuración de seguridad básica
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

@app.route('/')
def index():
    logger.info("📄 Página principal cargada")
    return render_template('index.html')

def send_email_async(nombre, email, organizacion, tipo, mensaje):
    """Sends email in the background"""
    try:
        logger.info(f"📧 Iniciando envío de email desde: {email}")
        
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
        
        logger.info(f"🔄 Conectando a SMTP...")
        with smtplib.SMTP('smtp.gmail.com', 587, timeout=10) as server:
            server.set_debuglevel(0)
            logger.info("🔐 Iniciando TLS...")
            server.starttls()
            logger.info("🔑 Autenticando...")
            server.login(GMAIL_USER, GMAIL_PASS)
            logger.info("📤 Enviando email...")
            server.sendmail(GMAIL_USER, DESTINO, msg.encode('utf-8'))
            
        logger.info(f"✅ Email enviado exitosamente a {DESTINO}")
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"❌ ERROR DE AUTENTICACIÓN: Credenciales incorrectas")
        logger.error(f"   Usuario: {GMAIL_USER}")
        logger.error(f"   Error: {str(e)}")
    except smtplib.SMTPException as e:
        logger.error(f"❌ ERROR SMTP: {str(e)}")
    except Exception as e:
        logger.error(f"❌ ERROR GENERAL al enviar email: {str(e)}")
        logger.exception("Detalles completos del error:")

@app.route('/send', methods=['POST'])
def send():
    try:
        logger.info("📝 Recibido formulario de contacto")
        
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
        
        logger.info(f"📋 Datos del formulario:")
        logger.info(f"   Nombre: {nombre}")
        logger.info(f"   Email: {email}")
        logger.info(f"   Organización: {organizacion}")
        logger.info(f"   Tipo: {tipo}")

        # Iniciar el envío en segundo plano
        thread = threading.Thread(
            target=send_email_async,
            args=(nombre, email, organizacion, tipo, mensaje)
        )
        thread.daemon = True
        thread.start()
        
        logger.info("✓ Hilo de envío iniciado, redirigiendo...")
        # Redirigir de inmediato sin esperar a que termine el envío
        return redirect('/')
        
    except Exception as e:
        logger.error(f"❌ ERROR al procesar formulario: {str(e)}")
        logger.exception("Detalles completos del error:")
        return "Ocurrió un error al procesar tu solicitud.", 500

if __name__ == '__main__':
    # Obtener puerto de las variables de entorno (para Digital Ocean/Heroku)
    port = int(os.environ.get('PORT', 8080))
    
    logger.info("="*50)
    logger.info("🚀 Iniciando aplicación Adamus Capital")
    logger.info(f"🌍 Puerto: {port}")
    logger.info(f"🔧 Entorno: {os.environ.get('FLASK_ENV', 'production')}")
    logger.info("="*50)
    
    # Solo para desarrollo local
    if os.environ.get('FLASK_ENV') == 'development':
        logger.info("🔧 Modo DESARROLLO activado")
        app.run(debug=True, host='0.0.0.0', port=port)
    else:
        logger.info("🏭 Modo PRODUCCIÓN activado")
        app.run(debug=False, host='0.0.0.0', port=port)
