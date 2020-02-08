#!/bin/bash

echo "The chapter " $2 " of " $1 " will be downloaded in"

folderName=Repositories/Mangas

mkdir $folderName
cd ./$folderName

mkdir -p $1/$2
DL_DIR=./$1/$2

echo "Scan will be downloaded in "$folderName$DL_DIR

cd $DL_DIR
i=0
while true
do
    if ((i < 10))
    then
        file='0'$i'.jpg'
        if [ ! -f "$file" ]
        then
            echo "Trying to get jpg 0"$i
            wget 'http://lelscanv.com/mangas/'$1'/'$2'/0'$i'.jpg' || break
        else
            echo "File "$file" exist"
        fi
    else
        file=$i'.jpg'
        if [ ! -f "$file" ]
        then
            echo "Trying to get jpg "$i
            wget 'http://lelscanv.com/mangas/'$1'/'$2'/'$i'.jpg' || break
        else
            echo "File "$file" exist"
        fi
    fi

    ((i++))
done

echo "The chapter " $2 " of " $1 " has been downloaded"
exit