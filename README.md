# Adamus Capital

Boutique Investment & Advisory web application built with Flask.

## Features
- Responsive design
- Contact form with email integration
- Modern UI with smooth animations
- Mobile-friendly

## Setup

1. Clone the repository
```bash
git clone https://github.com/Tech-Team-CB/adamus-capital-git.git
cd adamus-capital-git
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Create `.env` file with your credentials
```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
DESTINO_EMAIL=destination@email.com
SECRET_KEY=your-secret-key
FLASK_ENV=development
```

4. Run locally
```bash
python app.py
```

## Deployment

This app is configured for Heroku deployment with the included `Procfile`.

Configure environment variables in Heroku:
- `GMAIL_USER`
- `GMAIL_PASS`
- `DESTINO_EMAIL`
- `SECRET_KEY`
- `FLASK_ENV=production`

## Technologies
- Flask
- Python 3
- HTML/CSS/JavaScript
- SMTP for email
