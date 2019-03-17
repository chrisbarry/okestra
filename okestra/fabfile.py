from __future__ import with_statement
from fabric.api import *
from fabric.contrib.console import confirm
from fabric.contrib.files import upload_template

import os

# beta live p3

mode = "p3"

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

#env.hosts = ['python.mkmrd.com']
#env.user = 'okestra'
#env.passwords = {'okestra@python.mkmrd.com:22': 'zCeJCaT4xmYWxoGyGaWQ2qO6MMm0aL3xOjVk8Oww8au9cYMcG0Ao2bgCuE16dEE'}
env.key_filename=['~/.ssh/id_rsa.pem']
env.hosts = ['okestra.io']
env.user = 'chris'
#env.passwords = {'chris@www.fidelityokestra.com:22': 'zCeJCaT4xmYWxoGyGaWQ2qO6MMm0aL3xOjVk8Oww8au9cYMcG0Ao2bgCuE16dEE'}

# outername = "okestra-collab"  # or hemingwaybetab
outername = "okestra"  # or hemingwaybeta
repoName = "okestra"  # this is always the same, just on a different branch
project = "okestra"
#project_password = "zCeJCaT4xmYWxoGyGaWQ2qO6MMm0aL3xOjVk8Oww8au9cYMcG0Ao2bgCuE16dEE"
root_dir = '/opt/'


def deploy():
    code_dir = '/opt/' + outername + "/" + repoName
    with cd(code_dir):
        with prefix("source ../env_okestra/bin/activate"):
            run("git pull")
            run("python manage.py migrate")
            run("yarn")
            run("python manage.py collectstatic --noinput")
            run("supervisorctl restart okestra")
            # run("supervisorctl restart crossover")
            # run("pip install -r " + "requirements.txt --upgrade")
            # run("python manage.py migrate --settings " + repoName + ".settings.production")
            # run("bower install")

            # run("python manage.py compress --settings " + repoName + ".settings.production --force")


def backup_database():
    code_dir = '/opt/' + outername
    with cd(code_dir):
        run("pg_dump " + outername + " > backups/" + repoName + " --clean")


def download_database():
    code_dir = '/opt/' + outername
    with cd(code_dir):
        get('backups/' + outername, 'backups/' + repoName)


def import_file_into_database():
    local("psql -U `whoami` -d " + repoName + " -f backups/" + repoName)


def restore_local_database():
    local("dropdb " + repoName)
    local("createdb " + repoName)
    import_file_into_database()


def download_db():
    backup_database()
    download_database()
    restore_local_database()


def upload_db():
    # local("mkdir ../backups")
    # local("pg_dump " + repoName + " > backups/" + repoName + " --clean")
    put("backups/" + repoName, "/opt/" + outername + "/backups/" + repoName)
    code_dir = '/opt/' + outername
    with cd(code_dir):
        run("psql -U chris -d okestra -f backups/" + repoName)
