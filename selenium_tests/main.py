# This is a sample Python script.

# Press Maj+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import unittest
from selenium import webdriver
import page
import time

with open('etc/secret_key.txt') as f:
    SECRET_KEY = f.read().strip()

LOCAL=True
if LOCAL:
    URL_ROOT="http://localhost:4200/"
    EMAIL="a@a.com"
else:
    URL_ROOT="https://cycling-init-bot.toolforge.org/"
    with open('etc/secret_email.txt') as f:
        EMAIL = f.read().strip()


class TestHome(unittest.TestCase):
    def setUp(self):
        PATH = "/usr/bin/chromedriver"
        self.driver = webdriver.Chrome(PATH)
        self.driver.get(URL_ROOT+"home")

    def test_title(self):
        home_page = page.HomePage(self.driver)
        self.assertEqual(home_page.return_title(),"Cycling-Init-Bot")

    def test_UCIlink(self):
        home_page = page.HomePage(self.driver)
        home_page.click_UCI_link()
        self.assertEqual(self.driver.current_url,"https://www.uci.org/")

    def test_topbar_display(self):
        topbar_page = page.TopBarPage(self.driver)
        self.assertTrue(topbar_page.check_login())
        self.assertTrue(topbar_page.check_register())

    def test_topbar(self):
        topbar_page = page.TopBarPage(self.driver)
        topbar_page.click_login()

        self.assertEqual(self.driver.current_url,URL_ROOT+"login")
        topbar_page.click_CyclingInitBot()
        self.assertEqual(self.driver.current_url,URL_ROOT+"home")
        topbar_page.click_register()
        self.assertEqual(self.driver.current_url,URL_ROOT+"register")

    def tearDown(self):
        self.driver.close()

class TestRegister(unittest.TestCase):
    def setUp(self):
        PATH = "/usr/bin/chromedriver"
        self.driver = webdriver.Chrome(PATH)
        self.driver.get(URL_ROOT+"register")

    def test_register_1(self):
        register_page = page.RegisterPage(self.driver)
        #username missing
        register_page.first_name_element="first"
        register_page.last_name_element="last"
        register_page.email_element="a@a.com"
        register_page.password_element=SECRET_KEY
        register_page.confirm_password_element=SECRET_KEY
        register_page.click_submit()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, URL_ROOT+"register")

    def test_register_2(self):
        register_page = page.RegisterPage(self.driver)
        #wrong pass
        register_page.first_name_element="first"
        register_page.last_name_element="last"
        register_page.email_element="a@a.com"
        register_page.username_element="username"
        register_page.password_element=SECRET_KEY
        register_page.confirm_password_element="otherpass"
        register_page.click_submit()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, URL_ROOT+"register")

    def test_register_3(self):
        register_page = page.RegisterPage(self.driver)
        #wrong email
        register_page.first_name_element="first"
        register_page.last_name_element="last"
        register_page.email_element="a.com"
        register_page.username_element="username"
        register_page.password_element=SECRET_KEY
        register_page.confirm_password_element=SECRET_KEY
        register_page.click_submit()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, URL_ROOT+"register")

    def test_register_4(self):
        self.driver.get(URL_ROOT + "register")
        register_page = page.RegisterPage(self.driver)
        # correct
        register_page.first_name_element = "first"
        register_page.last_name_element = "last"
        register_page.email_element = EMAIL #is really sent!
        register_page.username_element = "tester2"
        register_page.password_element = SECRET_KEY
        register_page.confirm_password_element = SECRET_KEY
        register_page.click_submit()
        self.assertTrue(register_page.check_success())

    def test_UCIlink(self):
        register_page = page.RegisterPage(self.driver)
        register_page.click_cancel()
        self.assertEqual(self.driver.current_url,URL_ROOT+"login")

    def tearDown(self):
        self.driver.close()

class TestLogin(unittest.TestCase):
    def setUp(self):
        PATH = "/usr/bin/chromedriver"
        self.driver = webdriver.Chrome(PATH)
        self.driver.get(URL_ROOT + "login")

    def test_register_button(self):
        login_page = page.LoginPage(self.driver)
        login_page.click_register()
        self.assertEqual(self.driver.current_url, URL_ROOT + "register")

    def test_false_login(self):
        login_page = page.LoginPage(self.driver)
        login_page.username_element="false_tester"
        login_page.password_element="random_pass123"
        login_page.click_submit()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, URL_ROOT + "login")

    def test_true_login(self):
        self.driver.get(URL_ROOT + "login")
        login_page = page.LoginPage(self.driver)
        login_page.username_element = "tester1"  # is actif
        login_page.password_element = SECRET_KEY
        login_page.click_submit()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, URL_ROOT + "home")

    def tearDown(self):
        self.driver.close()

class TestMenu(unittest.TestCase):
    def setUp(self):
        PATH = "/usr/bin/chromedriver"
        self.driver = webdriver.Chrome(PATH)
        self.driver.get(URL_ROOT + "home")

    def test_guard(self):
        menu_page = page.MenuPage(self.driver)
        menu_page.click_menu()
        menu_page.click_race()
        self.assertTrue((URL_ROOT + "login") in self.driver.current_url)

    def test_guard2(self):
        self.driver.get(URL_ROOT + "login")
        login_page = page.LoginPage(self.driver)
        login_page.username_element="tester1" #is actif
        login_page.password_element=SECRET_KEY
        login_page.click_submit()
        menu_page = page.MenuPage(self.driver)
        menu_page.click_menu()
        menu_page.click_race()
        self.assertEqual(self.driver.current_url, URL_ROOT + "race")

    def tearDown(self):
        self.driver.close()

class TestPersMenu(unittest.TestCase):
    def setUp(self):
        PATH = "/usr/bin/chromedriver"
        self.driver = webdriver.Chrome(PATH)
        self.driver.get(URL_ROOT + "home")

    def test_nomenupers(self):
        menupers_page = page.MenuPersPage(self.driver)
        self.assertFalse(menupers_page.check_menu())

    def test_menupers(self):
        self.driver.get(URL_ROOT + "login")
        login_page = page.LoginPage(self.driver)
        login_page.username_element="tester1" #is actif
        login_page.password_element=SECRET_KEY
        login_page.click_submit()

        menupers_page = page.MenuPersPage(self.driver)
        self.assertTrue(menupers_page.check_menu())
        menupers_page.click_settings()
        self.assertEqual(self.driver.current_url, URL_ROOT + "user_settings")

    def test_logout(self):
        self.driver.get(URL_ROOT + "login")
        login_page = page.LoginPage(self.driver)
        login_page.username_element="tester1" #is actif
        login_page.password_element=SECRET_KEY
        login_page.click_submit()

        menupers_page = page.MenuPersPage(self.driver)
        menupers_page.click_logout()
        self.assertFalse(menupers_page.check_menu())
        topbar_page = page.TopBarPage(self.driver)
        self.assertTrue(topbar_page.check_login())

    def tearDown(self):
        self.driver.close()
# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    unittest.main()
