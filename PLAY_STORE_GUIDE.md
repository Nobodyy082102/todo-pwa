# 🚀 Guida: Pubblicare su Google Play Store

## 📋 Requisiti Necessari

### 1. **Account Google Play Console**
- Costo: $25 (una tantum)
- Link: https://play.google.com/console/

### 2. **Requisiti App**
- ✅ PWA funzionante online (https://nobodyy082102.github.io/todo-pwa/)
- ✅ Manifest completo
- ✅ Service Worker attivo
- ✅ HTTPS obbligatorio
- ✅ Icone in tutte le dimensioni
- ✅ Privacy Policy obbligatoria
- ✅ Screenshots per lo store

---

## 🛠️ Metodo 1: PWABuilder (RACCOMANDATO - Più Facile)

### Step 1: Genera APK con PWABuilder
1. Vai su: **https://www.pwabuilder.com/**
2. Inserisci URL: `https://nobodyy082102.github.io/todo-pwa/`
3. Clicca "Start" e attendi l'analisi
4. Clicca su "Package For Stores" → "Android"
5. Configura:
   - **Package ID**: `com.taskmanager.app` (o altro)
   - **App name**: Task Manager
   - **Version**: 1.0.0
   - **Signing key**: Genera nuovo (scarica e conserva!)
6. Scarica l'APK generato (`.aab` bundle)

### Step 2: Carica su Play Console
1. Accedi a: https://play.google.com/console/
2. Crea nuova app
3. Compila informazioni store:
   - Nome: Task Manager
   - Descrizione breve/lunga
   - Screenshots (almeno 2)
   - Icona 512x512
   - Feature graphic 1024x500
4. Carica il file `.aab`
5. Compila privacy policy
6. Invia per revisione

---

## 🛠️ Metodo 2: Bubblewrap CLI (Avanzato)

### Prerequisiti
```bash
# Installa Node.js 18+
node --version

# Installa JDK 11+
java -version

# Installa Android SDK
# Download: https://developer.android.com/studio
```

### Step 1: Installa Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### Step 2: Inizializza Progetto
```bash
bubblewrap init --manifest https://nobodyy082102.github.io/todo-pwa/manifest.webmanifest
```

Rispondi alle domande:
- **Domain**: nobodyy082102.github.io
- **Package name**: com.taskmanager.app
- **App name**: Task Manager
- **Start URL**: /todo-pwa/
- **Theme color**: #2563eb
- **Background color**: #ffffff

### Step 3: Build APK
```bash
# Build in modalità release
bubblewrap build --release

# L'APK sarà in: app-release-bundle.aab
```

### Step 4: Firma l'APK
```bash
# Genera keystore (una sola volta)
keytool -genkey -v -keystore taskmanager.keystore -alias taskmanager -keyalg RSA -keysize 2048 -validity 10000

# Firma l'APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore taskmanager.keystore app-release-bundle.aab taskmanager
```

**⚠️ IMPORTANTE**: Conserva il file `taskmanager.keystore` in un posto sicuro! Serve per tutti gli aggiornamenti futuri.

---

## 📸 Screenshots Richiesti

### Requisiti Google Play:
- **Minimo**: 2 screenshots
- **Consigliato**: 4-8 screenshots
- **Dimensioni**:
  - Phone: 320-3840px (larghezza o altezza)
  - Ratio: 16:9 o 9:16
  - Formato: PNG o JPG

### Come crearli:
1. Apri l'app in Chrome DevTools (F12)
2. Modalità responsive (Ctrl+Shift+M)
3. Seleziona "Pixel 5" (1080x2340)
4. Screenshot delle schermate principali:
   - ✅ Home con lista todo
   - ✅ Aggiungi task
   - ✅ Statistiche
   - ✅ Impostazioni/temi
   - ✅ Notifiche (se possibile)

---

## 🎨 Grafica Store Richiesta

### 1. **App Icon** (già fatto ✅)
- 512x512px PNG
- File: `pwa-512x512.png`

### 2. **Feature Graphic** (da creare)
- 1024x500px PNG/JPG
- Usa per banner principale store
- Tool: Canva, Figma, Photoshop

### 3. **Screenshots** (da creare)
- Minimo 2, consigliato 4-8
- Dimensioni phone standard

---

## 📄 Privacy Policy (OBBLIGATORIA)

### Cosa deve contenere:
1. Quali dati raccogli (anche se nessuno)
2. Come li usi
3. Dove li memorizzi (localStorage locale)
4. Diritti utente (GDPR)
5. Contatto sviluppatore

### Dove pubblicarla:
- **Opzione 1**: GitHub Pages → `/privacy-policy.html`
- **Opzione 2**: Servizi gratuiti:
  - https://www.privacypolicygenerator.info/
  - https://www.freeprivacypolicy.com/

✅ **Privacy Policy già creata!**
- **URL da usare su Play Store**: `https://nobodyy082102.github.io/todo-pwa/privacy-policy.html`
- File disponibile in: `public/privacy-policy.html`
- Conforme a GDPR, CCPA e requisiti Google Play Store

---

## ✅ Checklist Pre-Pubblicazione

### Manifest PWA
- [x] Nome app completo
- [x] Short name
- [x] Description
- [x] Theme color
- [x] Background color
- [x] Display: standalone
- [x] Start URL corretta
- [x] Scope corretta
- [x] Icone 192x192, 512x512
- [x] Orientamento

### Store Assets
- [x] Icon 512x512 ✅
- [ ] Feature graphic 1024x500
- [ ] Screenshots (min 2)
- [x] Privacy policy URL ✅ (https://nobodyy082102.github.io/todo-pwa/privacy-policy.html)
- [ ] Descrizione breve (80 caratteri)
- [ ] Descrizione lunga (4000 caratteri)

### Tecnici
- [x] HTTPS attivo
- [x] Service worker funzionante
- [x] Offline mode
- [x] Lighthouse score > 80
- [ ] Nessun errore console
- [ ] Compatibilità Android 5+

---

## 💡 Suggerimenti

### 1. **Categoria Store**
- Scegli: **Productivity** o **Business**

### 2. **Keywords (ASO - App Store Optimization)**
- task manager
- todo list
- productivity
- gestione attività
- organizer
- reminder
- to-do

### 3. **Pricing**
- **Gratuita**: Nessun in-app purchase
- Rating: **E (Everyone)**

### 4. **Descrizione Store** (esempio)
```
Task Manager è un'app di produttività potente e intuitiva per gestire le tue attività quotidiane.

🌟 CARATTERISTICHE PRINCIPALI:
✅ Gestione completa delle attività
📊 Statistiche e grafici avanzati
🔔 Notifiche e promemoria
🎨 Temi personalizzabili
📱 Funziona offline
🚀 Veloce e leggera

FUNZIONALITÀ:
• Aggiungi task con priorità e categorie
• Imposta promemoria e notifiche
• Visualizza statistiche completamento
• Filtra e cerca attività
• Modalità Focus per concentrazione
• Routine predefinite
• Tema scuro/chiaro
• Supporto offline completo

100% GRATUITA - NESSUNA PUBBLICITÀ - PRIVACY RISPETTATA
Tutti i dati sono salvati localmente sul tuo dispositivo.
```

---

## 🐛 Problemi Comuni

### 1. "App not secure"
**Fix**: Verifica che il sito usi HTTPS (✅ già fatto con GitHub Pages)

### 2. "Manifest not found"
**Fix**: Verifica che `manifest.webmanifest` sia accessibile

### 3. "Service worker not registered"
**Fix**: Verifica PWA in Chrome DevTools → Application → Service Workers

### 4. "Icons not loading"
**Fix**: Path relativi nelle icone (✅ già fatto)

---

## 📞 Supporto

- **PWABuilder**: https://github.com/pwa-builder/PWABuilder/issues
- **Bubblewrap**: https://github.com/GoogleChromeLabs/bubblewrap/issues
- **Play Console Help**: https://support.google.com/googleplay/android-developer

---

## 🎯 Prossimi Passi

1. ✅ Ottimizzare manifest (fatto da me)
2. ✅ Creare icone mancanti (fatto da me)
3. ✅ Privacy policy (creata da me)
4. ⏳ Creare screenshots (da fare da te o io posso aiutare)
5. ⏳ Generare APK con PWABuilder (facilissimo!)
6. ⏳ Caricare su Play Console
7. ⏳ Attendere approvazione (1-7 giorni)

---

**Tempo stimato**: 2-3 ore se hai tutto pronto
**Costo**: $25 (account Google Play Developer) + gratuito per il resto
