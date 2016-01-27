# About Github
##The instruction of Github (Branch)

###1. Clone the repository to local:
	git clone https://github.com/cmusv-fse/S16-A1-SSNoC.git
###2. Each time need update (recommend, avoid merge conflict):
	git pull
###3. Check the change:
	git status
###4. Add File:
	touch README.md // create a file named README
	git add . //add all
	git add README.md
###5. Commit (must do this after adding file):
	git commit -m “…..(here is the commit message, like Update XXX)”
	or git commit           
	(Recommend using this method, can commit multiple lines, the first line should be a brief introduction and the second line should explain the change in details.)
###6. Update the change to remote repository (Github)
	git push    // this is push into ‘master’, everyone should push to his own branch first!

##About Using branch
###1. Go to your branch / or return to master
	git checkout <branch-name> 
	git checkout master
###2. List all of the branch in your repository
	git branch
###3. Create a new branch
	git branch <branch-name> or git checkout -b <branch-name>
###4. Push the branch on Github
	git push -u origin <branch-name>    
	--Or using 
	git push origin 
	--but the first time need :
	git push -u origin
	git push --set-upstream origin <branch-name> 
	--Recommend! Everyone need upload to upload to his own branch in Github
	git push -u origin <local-branch name>:<remote-branch name>
###5. Delete a branch in local
	git branch -d <branch-name> 
	or 
	git branch -D <branch-name> 
	// this one is to force the deletion of local, even not merge
###6. Delete a branch on Github
	git push origin :<branch-name>
###7. Merge branch
	git checkout master
	git merge --ff <branch-name>