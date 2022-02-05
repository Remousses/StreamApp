#!/bin/bash
manga=$1
chapter=$2

echo 'The chapter ' $chapter ' of ' $manga ' will be downloaded in'

folderName=Repositories/Mangas
mangasPath=$(echo ${manga^} | tr "-" " ")/'Scan'/$chapter

mkdir $folderName
cd ./$folderName

mkdir -p "$mangasPath"
DL_DIR=./$mangasPath
url='https://lelscans.net/mangas/'$manga'/'$chapter'/'

echo 'Scan will be downloaded in '$folderName'/'$mangasPath

cd "$DL_DIR"
i=0
while true
do
    if ((i < 10)); then
        jpg='0'$i'.jpg'
        png='0'$i'.png'
        if [ -f "$jpg" ] || [ -f "$png" ];  then
            echo 'File 0'$i' already exist'
        else
            echo 'Trying to get image 0'$i
            wget $url$jpg || wget $url$png || break
        fi
    else
        jpg=$i'.jpg'
        png=$i'.png'
        if [ -f "$jpg" ] || [ -f "$png" ]; then
            echo 'File '$i' already exist'
        else
            echo 'Trying to get image '$i
            wget $url$jpg || $url$png || break
        fi
    fi
    ((i++))
done

echo 'The chapter ' $chapter ' of ' $manga ' has been downloaded'
exit