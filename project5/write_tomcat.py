import sys, random
from locust import HttpLocust, TaskSet

#Write intensive
def savePost(locust):
    name = '/editor/post?action=save'
    num = random.randint(1,500)
    reqString = '/editor/post?action=save&username=cs144&postid=' + str(num) + '&title=Loading%20Test&body=***Hello%20World!***'
    locust.client.post(reqString, name=name)

class MyTaskSet(TaskSet):
    """ the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = [savePost]
    def on_start(locust):
        """ on_start is called when a Locust start before any task is scheduled """
        pass

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000