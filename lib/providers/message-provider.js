const MessageBuilder = require('./message/message-builder');
const HelpEntryBuilder = require('../repl/help/help-entry-builder');

/**
 * The MessageProvider allows scripting to display informational or error
 * messages on the user interface to end users.
 *
 * For more information, see:
 * https://developer.gtnexus.com/platform/scripts/built-in-functions/error-messages-to-ui
 */
class MessageProvider {

    constructor() {
        this.messages = [];
    }

    /**
     * info - this method flags the current message to be presented as an
     *        informational message in the UI.
     *        For more information, see:
     *        https://developer.gtnexus.com/platform/scripts/built-in-functions/error-messages-to-ui
     *
     * @return {MessageBuilder}
     */
    info() {
        let self = this;
        return new MessageBuilder('info', (msg) => {
            this.messages.push(msg);
        });
    }

    warning() {
        let self = this;
        return new MessageBuilder('warning', (msg) => {
            this.messages.push(msg);
        });
    }


    /**
     * error - This method flags the current message to be presented as an error
     *         message in the UI.
     *         For more information, see:
     *         https://developer.gtnexus.com/platform/scripts/built-in-functions/error-messages-to-ui
     *
     * @return {MessageBuilder}
     */
    error() {
        return new MessageBuilder('error', (msg) => {
            this.messages.push(msg);
        });
    }

    getMessages() {
        return this.messages.slice();
    }

    reset() {
        this.messages = [];
    }
}

HelpEntryBuilder.forAppXpress(__filename,'MessageProvider').defer();

module.exports = MessageProvider;
