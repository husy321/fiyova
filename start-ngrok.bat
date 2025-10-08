@echo off
echo Starting ngrok...
echo.
echo If this closes immediately, you need to:
echo 1. Sign up at https://dashboard.ngrok.com/signup
echo 2. Get your auth token
echo 3. Run: ngrok config add-authtoken YOUR_TOKEN
echo.
pause
ngrok http 3000
