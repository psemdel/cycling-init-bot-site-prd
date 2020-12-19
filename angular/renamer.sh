#!/bin/bash
ng build --prod="true"

for file in "main" "polyfills-es5" "runtime"
do
    main=`(find "dist/demo/" -name "$file*")`
    cp $main "../bot_requests/static/$file.cycling.js"
done

for file in "polyfills."
do
    main=`(find "dist/demo/" -name "$file*")`
    cp $main "../bot_requests/static/$file.cycling.js"
done

file="styles"
main=`(find "dist/demo/" -name "$file*")`
cp $main "../bot_requests/static/$file.cycling.css"


