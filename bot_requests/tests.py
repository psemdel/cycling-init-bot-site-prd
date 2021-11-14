# -*- coding: utf-8 -*-

from django.test import RequestFactory, TestCase
from django.contrib.auth.models import AnonymousUser, User

from .views import get_request_list

class SimpleTest(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username='tester1', email='a@a.com', password='t_e_s_t_e_r_1')
        print(self.user.id)

    def test_guard(self):
        request = self.factory.get('/get/create_rider/1')
        request.user = AnonymousUser()
        response = get_request_list(request, 1, "create_rider")
        self.assertEqual(response.status_code, 401)
    
