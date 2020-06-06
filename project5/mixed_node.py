import sys, random
from locust import HttpLocust, TaskSet

#Read intensive
def readPost(locust):
    name = '/blog/cs144'
    num = random.randint(1,500)
    reqString = name + '/' + str(num)
    locust.client.get(reqString, name=name)

#Read intensive
def writePost(locust):
    name = '/api/cs144'
    num = random.randint(1,500)
    reqString = name + '/' + str(num)

    putData = {
        'title' : 'Loading Test',
        'body' : '***Hello World!***'
    }
    locust.client.put(reqString, putData, name=name)

class MyTaskSet(TaskSet):
    """ the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = {readPost: 9, writePost: 1}
    def on_start(locust):
        """ on_start is called when a Locust start before any task is scheduled """
        response = locust.client.post("/login", data={"username":"cs144", "password": "password"})
        if response.status_code != 200:
            print("FAIL to start with posting data to server. Make sure that your server is running.")
            sys.exit();

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000