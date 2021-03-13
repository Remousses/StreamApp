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

echo 'Scan will be downloaded in '$folderName'/'$mangasPath

cd "$DL_DIR"
i=0
while true
do
    if ((i < 10))
    then
        file='0'$i'.jpg'
        if [ ! -f "$file" ]
        then
            echo 'Trying to get jpg 0 '$i
            wget 'https://lelscans.net/mangas/'$manga'/'$chapter'/0'$i'.jpg' || break
        else
            echo 'File '$file' already exist'
        fi
    else
        file=$i'.jpg'
        if [ ! -f "$file" ]
        then
            echo 'Trying to get jpg '$i
            wget 'https://lelscans.net/mangas/'$manga'/'$chapter'/'$i'.jpg' || break
        else
            echo 'File '$file' already exist'
        fi
    fi
    ((i++))
done

echo 'The chapter ' $chapter ' of ' $manga ' has been downloaded'
exit