#!/bin/bash
echo "Waiting for the application goes online..."
sleep 15
swaggerUrl="http://localhost:$port_mapping/swagger/v1/swagger.json"
api=$(curl $swaggerUrl)
status=$?
if test $status -ne 0
then
	exit 1
fi
api=$(jq 'del(.components.securitySchemes)' <<<$api)
api=$(jq 'del(.security)' <<<$api)
echo $api > apiFinal.json
request='{"spec":{},"type":"CLIENT","lang":"typescript-angular"}'
request=$(jq --argfile apiFinal apiFinal.json '.spec = $apiFinal' <<<$request)
echo $request > ts.json
sudo rm -rf client
java -jar CICD/swagger-codegen-cli.jar generate -i apiFinal.json -l typescript-angular -o client --additional-properties modelPropertyNaming=original
sudo rm -rf ts.json;
sudo rm -rf production_file;
sudo rm -rf apiFinal.json;
temp_path=$(pwd);
mkdir production_file;
sudo cp -r client/*.ts production_file/; cp -r client/api production_file/; cp -r client/model production_file/; rm -rf client; mv production_file client
bash CICD/swagger_download client
git clone --single-branch --branch $fe_model_branch "git@$fe_git_address.git"
cd $fe_git_project_name
git pull origin $fe_model_branch;
bash $temp_path/CICD/cp_ad $temp_path/client $temp_path/$fe_git_project_name/src/app $temp_path/client
git add --all; git commit -m "Update model auto" --allow-empty; git push "git@$fe_git_address.git" HEAD:$fe_model_branch