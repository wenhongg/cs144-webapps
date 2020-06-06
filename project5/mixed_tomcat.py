# locust_test.py
# In python, '#' is used to indicate a comment line.
"""
The string within triple-quote is also considered as a comment.
And the triple-quote can be used for multiline comments.
DISCLAIMER: This sample doesn't care about whether the use of API is correct.
"""

import sys, random
from locust import HttpLocust, TaskSet

#Read intensive
def readPost(locust):
    name = '/editor/post?action=open'
    num = random.randint(1,500)
    reqString = '/editor/post?action=open&username=cs144&postid=' + str(num)
    locust.client.get(reqString, name=name)

#Write intensive
def savePost(locust):
    name = '/editor/post?action=save'
    num = random.randint(1,500)
    reqString = '/editor/post?action=save&username=cs144&postid=' + str(num) + '&title=Loading%20Test&body=***Hello%20World!***'
    locust.client.post(reqString, name=name)

class MyTaskSet(TaskSet):
    """ the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = {readPost: 9, savePost: 1}
    def on_start(locust):
        """ on_start is called when a Locust start before any task is scheduled """
        pass

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000