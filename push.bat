mkdir obj
mkdir cur
node minify -s=false -v=true -i=html5 -o=obj -c=cur
ftp -i -n -s:commands.txt seanmcbeth.com