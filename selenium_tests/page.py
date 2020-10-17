from element import BasePageElement
from locator import (HomePageLocators, TopBarLocators, RegisterPageLocators,
MenuLocators, LoginLocators, MenuPersLocators)

class BasePage(object):
    """Base class to initialize the base page that will be called from all pages"""

    def __init__(self, driver):
        self.driver = driver

class HomePage(BasePage):
    def return_title(self):
        """Verifies that the hardcoded text "Python" appears in page title"""
        return self.driver.title

    def click_UCI_link(self):
        """Triggers the search"""
        element = self.driver.find_element(*HomePageLocators.UCI_LINK)
        element.click()

class TopBarPage(BasePage):
    def click_CyclingInitBot(self):
        element = self.driver.find_element(*TopBarLocators.CYCLINGINITBOT_LINK)
        element.click()

    def check_login(self):
        element = self.driver.find_element(*TopBarLocators.LOGIN_BUTTON)
        return element.is_displayed()

    def click_login(self):
        element = self.driver.find_element(*TopBarLocators.LOGIN_BUTTON)
        element.click()

    def check_register(self):
        element = self.driver.find_element(*TopBarLocators.REGISTER_BUTTON)
        return element.is_displayed()

    def click_register(self):
        element = self.driver.find_element(*TopBarLocators.REGISTER_BUTTON)
        element.click()

class FirstNameElement(BasePageElement):
    locator='input[formcontrolname=first_name]'

class LastNameElement(BasePageElement):
    locator='input[formcontrolname=last_name]'

class UsernameElement(BasePageElement):
    locator='input[formcontrolname=username]'

class EmailElement(BasePageElement):
    locator='input[formcontrolname=email]'

class PasswordElement(BasePageElement):
    locator='input[formcontrolname=password]'

class ConfirmPasswordElement(BasePageElement):
    locator = 'input[formcontrolname=confirmPass]'

class RegisterPage(BasePage):
    username_element = UsernameElement()
    first_name_element = FirstNameElement()
    last_name_element = LastNameElement()
    email_element=EmailElement()
    password_element=PasswordElement()
    confirm_password_element = ConfirmPasswordElement()

    def click_submit(self):
        element = self.driver.find_element(*RegisterPageLocators.SUBMIT_BUTTON)
        element.click()

    def click_cancel(self):
        element = self.driver.find_element(*RegisterPageLocators.CANCEL_LINK)
        element.click()

    def check_success(self):
        element = self.driver.find_element(*RegisterPageLocators.SUCCESS_TEXT)
        return element.is_displayed()

class MenuPage(BasePage):
    def click_menu(self):
        element = self.driver.find_element(*MenuLocators.MENU_BUTTON)
        element.click()

    def click_race(self):
        element = self.driver.find_element(*MenuLocators.RACE_LINK)
        element.click()

class MenuPersPage(BasePage):
    def check_menu(self):
        element = self.driver.find_element(*MenuPersLocators.MENU_PERS_BUTTON)
        element.is_displayed()

    def click_menu(self):
        element = self.driver.find_element(*MenuPersLocators.MENU_PERS_BUTTON)
        element.click()

    def click_settings(self):
        element = self.driver.find_element(*MenuPersLocators.SETTINGS_BUTTON)
        element.click()

    def click_logout(self):
        element = self.driver.find_element(*MenuPersLocators.LOGOUT_BUTTON)
        element.click()

class LoginPage(BasePage):
    username_element = UsernameElement()
    password_element = PasswordElement()

    def click_register(self):
        element = self.driver.find_element(*LoginLocators.REGISTER_BUTTON)
        element.click()

    def click_submit(self):
        element = self.driver.find_element(*LoginLocators.SUBMIT_BUTTON)
        element.click()