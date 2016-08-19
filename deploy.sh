rm -rf dev.r6stats.com/
git config user.email "support@r6stats.com"
git config user.name "R6Stats Deploybot"
git clone git@github.com:R6Stats/dev.r6stats.com.git
cp -r build/* dev.r6stats.com/
cd dev.r6stats.com/
ls
git add -A
git commit -am "Update documentation"
git push -u origin master
rm -rf dev.r6stats.com/