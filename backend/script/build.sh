# babel build bash script
start=$SECONDS

echo "clean build directory"
rm -rf "./build"

echo "copy target files"
mkdir "./build"
cp -r ./DB ./build/DB
cp -r ./express ./build/express
cp -r ./socket_io_server ./build/socket_io_server
cp -r ./graphQL ./build/graphQL
cp -r ./libs ./build/libs
cp -r ./redis ./build/redis

echo "copy .env"
cp .env ./build/.env

source_dir="./build"
out_dirs="./build"
ignore_dirs='build/express/public'

echo "run babel build"
npx babel $source_dir --out-dir $out_dirs --ignore $ignore_dirs --verbose --source-maps

end=$SECONDS
duration=$((end - start))
echo "build take $duration seconds to complete"
