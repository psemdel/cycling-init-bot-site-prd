from selenium.webdriver.common.by import By

class HomePageLocators(object):
    """A class for main page locators. All main page locators should come here"""
    UCI_LINK= (By.LINK_TEXT, 'UCI')

class TopBarLocators(object):
    CYCLINGINITBOT_LINK = (By.TAG_NAME, 'h1')
    LOGIN_BUTTON = (By.PARTIAL_LINK_TEXT, "login")
    REGISTER_BUTTON = (By.PARTIAL_LINK_TEXT, "register")

class RegisterPageLocators(object):
    SUBMIT_BUTTON=(By.ID, "submit")
    CANCEL_LINK=(By.PARTIAL_LINK_TEXT, "Cancel")
    SUCCESS_TEXT=(By.CLASS_NAME,"content")

class MenuLocators(object):
    MENU_BUTTON=(By.ID,"main_menu")
    RACE_LINK = (By.CSS_SELECTOR, 'a[routerLink="race"]')

class MenuPersLocators(object):
    MENU_PERS_BUTTON=(By.ID,"menu_pers")
    SETTINGS_BUTTON=(By.CSS_SELECTOR, 'a[routerLink="user_settings"]')
    LOGOUT_BUTTON=(By.ID,"logout")

class LoginLocators(object):
    SUBMIT_BUTTON = (By.ID, "submit")
    REGISTER_BUTTON = (By.PARTIAL_LINK_TEXT, "Register")