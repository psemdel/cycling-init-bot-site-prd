from django.test import TestCase, Client

class RegisterTests(TestCase):
    def test_1(self):
        c = Client()
        
        dic={"first_name":"first",
            "last_name":"last",
            "username":"tester1",
            "password":"t_e_s_t_e_r_1",
            "confirmPassword":"t_e_s_t_e_r_1",
            "email":"a@a.com",
            }
        
        response = c.post('/auth/users/', dic)
        self.assertIs(response.status_code, 201)


#class LoginTests(TestCase):
    
#    def test_1(self):
#        c = Client()
 #       response = c.post('/users/authenticate/', {'username': 'john', 'password': 'smith'})
#        
#        self.assertIs(response.status_code, 401)
        
#    def test_2(self):
#        c = Client()
#        response = c.post('/users/authenticate/', {'username': 'tester', 'password': 'tester123'})
        
#        self.assertIs(response.status_code, 201)
        
        
