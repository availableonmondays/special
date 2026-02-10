@echo off
echo ===================================
echo   SAVING & UPLOADING PHOTOS...
echo ===================================

git add .
git commit -m "Updated photos"
git push

echo.
echo ===================================
echo   DONE! Site will update in ~30s.
echo ===================================
pause
