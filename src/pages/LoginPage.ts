import BasePage from './BasePage';
import SecuredPage from './SecuredPage';
import ILoginPage from '../interfaces/ILoginPage';

const loginSelectors = require('../selectors/login.json');

export default class LoginPage extends BasePage implements ILoginPage {
    constructor() {
        super();
    }

    get username() : WebdriverIO.Element {
        return browser.$(loginSelectors.usernameLocator);
    }

    get password() : WebdriverIO.Element {
        return browser.$(loginSelectors.passwordLocator);
    }

    get loginButton() : WebdriverIO.Element {
        return browser.$(loginSelectors.loginButtonLocator);
    }

    enterLoginInformation(usernameValue, passwordValue) : void {
        this.username.setValue(usernameValue);
        this.password.setValue(passwordValue);
    }

    clickSubmitButton() : void {
        // Same issue with the antivirus pop occurs with webdriverio as well as webdriver.
        // The workaround is to click with javascript to bypass the pop-up.
        try {
            this.loginButton.click();
        } catch (err) {
            browser.execute(() => {
                const button: any = document.getElementsByClassName('radius')[0];
                button.click();
            });
        }
    }

    login(usernameValue, passwordValue) : SecuredPage {
        const securedScreenPresenceLocator = 'a.radius';
        this.enterLoginInformation(usernameValue, passwordValue);
        this.clickSubmitButton();
        browser.$(securedScreenPresenceLocator).waitForDisplayed();
        return new SecuredPage();
    }
}
