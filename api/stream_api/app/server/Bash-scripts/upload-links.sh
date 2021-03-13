#!/bin/bash

input=$@
linksArray=($input)
folderDestination=${linksArray[0]}
errors=()

mkdir -p $folderDestination
cd ./$folderDestination

echo ${linksArray[*]}

for link in ${linksArray[*]}
do
    # if not folder destination and value after last slash match
    if [ $link != $folderDestination ] && [[ $link =~ [^\/]+$ ]]
    then
        fileName=${BASH_REMATCH}

        if [ ! -f $fileName ]
        then
            if ! wget $link
            then
                echo 'Error during downloaded file '$fileName
                errors+=('Error_during_downloaded_file_'$fileName)
            fi
        else
            echo 'File '$fileName' already exist'
            errors+=('File_'$fileName'_already_exist')
        fi
    fi
done

# check errors
if (( ${#errors[*]} >= 1 ))
then
    echo 'Récapitulatif des erreurs :'
    for error in ${errors[*]}
    do
        echo $error
    done
    exit
fi

if (( ${#linksArray[*]} > 2 ))
then
    echo 'Toutes les fichiers ont été téléchargés dans le répertoire '$folderDestination
else
    echo 'Le fichier a été téléchargé dans le répertoire '$folderDestination
fi

exit