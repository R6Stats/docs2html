rm -rf dev.r6stats.com/
git clone git@github.com:R6Stats/dev.r6stats.com.git
# rm -r dev.r6stats.com/*

if [ ! -d "$build" ]; then
	echo "Building..."
	gulp build
fi

cp -r build/* dev.r6stats.com/
cd dev.r6stats.com/
git config user.email "support@r6stats.com"
git config user.name "R6Stats Deploybot"
ls
git add -A
git commit -am "Update documentation"
git push -u origin master
rm -rf dev.r6stats.com/