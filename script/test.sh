# backend test
cd ./backend
yarn test
cd ..

# front end guest app test
cd ./frontend/guest-app
yarn test a --watchAll=false
cd ..
cd ..

# front end guest app test
cd ./frontend/host-app
yarn test a --watchAll=false
cd ..
cd ..

# front end guest app test
cd ./frontend/main-app
yarn test a --watchAll=false
cd ..
cd ..
