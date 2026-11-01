@echo off
rem Runs at low priority so other programs stay fast. Close this window anytime; run again to continue.
cd /d "%~dp0.."
set VENV=..\ocr-output\venv
if not exist "%VENV%\Scripts\python.exe" (
  python -m venv "%VENV%" || goto :failed
  "%VENV%\Scripts\python.exe" -m pip install -q rapidocr-onnxruntime pillow numpy || goto :failed
)
start "" /low /b /wait "%VENV%\Scripts\python.exe" -I scripts\ocr_pages.py
pause
exit /b

:failed
echo Setup failed. Check that Python is installed and you are online, then run this again.
pause
