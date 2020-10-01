rem Return to main folder
cd ..

rem Run build
call npm run build

rem Installl project dependencies
xcopy package.json "./dist"
xcopy package-lock.json "./dist"
call npm --prefix ./dist install ./dist --production 
cd dist
del package.json
del package-lock.json
cd ..

rem Copy deployment files
xcopy /s "./deploy/azure" "./dist"

rem Start deployment
cd dist
sls deploy
cd ..