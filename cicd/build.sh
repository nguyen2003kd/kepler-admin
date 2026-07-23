#!/bin/bash
sudo docker build -t $image_name:$tag -f $docker_path/Dockerfile .
sudo docker logout registry.gitlab.com
echo "$CI_REGISTRY_PW" | sudo docker login registry.gitlab.com -u "$CI_REGISTRY_USER" --password-stdin
sudo docker push $image_name:$tag
sudo docker rmi $image_name:$tag