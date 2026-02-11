@echo off
copy /y dist\roonganan_newlogo.png src\assets\roonganan_newlogo.png
if exist src\assets\roonganan_newlogo.png (
    echo Copy Success
) else (
    echo Copy Failed
)
