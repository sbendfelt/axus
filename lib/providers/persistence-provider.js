const NotificationBuilder = require('./notification/notification-builder');
const HelpEntryBuilder = require('../repl/help/help-entry-builder');

/**
 * The Persistence Provider allows scripting to perform operations which require
 * the persistence store. For example, fetching an object by UID, or processing
 * workflow action.
 */
class PersistenceProvider {

    constructor(bridge) {
        this.toSave = [];
        this.bridge = bridge;
        this.toProcessAction = [];
        this.publications = [];
        this.fetchRequests = [];
        this.toSave = [];
    }

    /**
     * save - Saves the object that is passed into the function.
     *        For more information, see:
     *        https://developer.gtnexus.com/platform/scripts/built-in-functions/saving-an-object
     *
     * @param  {Object} obj The object to be saved.
     * @return {void}
     */
    save(obj) {
        this.toSave.push(obj);
    }


    /**
     * processAction - transitions an object from one workflow state to another
     *                 via an action as specified in the object's workflow.
     *                 For more information, see:
     *                 https://developer.gtnexus.com/platform/scripts/built-in-functions/transitioning-an-object
     *
     * @param  {Object} obj    The object to take action on.
     * @param  {String} action The action to take on the object.
     * @return {Void}
     */
    processAction(obj, action) {
        this.toProcessAction.push({
            target: obj,
            action: action
        });
    }


    /**
     * createFetchRequest - Get the object based on object:
     *                        type, or:
     *                        type, uid or:
     *                        type, apiVersion, uid.
     *                      For more information, see:
     *                      https://developer.gtnexus.com/platform/scripts/built-in-functions/fetching-an-object
     *
     * @return {PlatformFetchRequest}
     */
    createFetchRequest() {
        const argLength = arguments.length;
        if (!argLength || argLength > 3) {
            throw new TypeError(`Unsupported parameters used in createFetchRequest
        function. Please check persistenceProvider API.`);
        }
        let req;
        if (argLength === 1) {
            const [type] = Array.prototype.slice.call(arguments);
            req = this.bridge.newFetchRequest(type);
        } else if (argLength === 2) {
            const [type, uid] = Array.prototype.slice.call(arguments);
            req = this.bridge.newFetchRequest(type, null, uid);
        } else if (argLength === 3) {
            const [type, apiVersion, uid] = Array.prototype.slice.call(arguments);
            req = this.bridge.newFetchRequest(type, apiVersion, uid);
        }
        this.fetchRequests.push(req);
        return req;
    }


    /**
     * publishOutbound - sends a notification of any type.
     *                   For more information, see:
     *                   https://developer.gtnexus.com/platform/scripts/built-in-functions/sending-a-notification
     *
     * @return {(Void|NotificationBuilder)}
     */
    publishOutbound() {
        const argLength = arguments.length;
        if (!arguments.length) {
            return new NotificationBuilder((publication) => {
                this.publications.push(publication);
            });
        }
        if (argLength === 2) {
            this.publications.push({
                target: arguments[0],
                topic: arguments[1]
            });
        } else {
            if (argLength === 1) {
                throw new TypeError(`Single parameter publishOutbound function
          is not supported at this time.`);
            }
            throw new TypeError(`Unsupported parameters used in publishOutbound
        function. Please check persistenceProvider API.`);
        }
    }


    /**
     * isMarkedForSave - checks to see if Providers.getPersistenceProvider.save()
     *                   was called on this object within the script.
     *
     * @param  {type} obj The Object we are interested in.
     * @return {Boolean}     Whether or not save() has been called on this object.
     */
    isMarkedForSave(obj) {
      throw new Error('Unimplemented');
    }


    /**
     * getStateAsLoaded - return the workflow state when the object was loaded.
     *                    Useful in determining the state the object was in
     *                    prior to this transition.
     *
     * @return {String}  The state of the object prior to this transition.
     */
    getStateAsLoaded() {
      return this.bridge.getRunAsScope().stateAsLoaded;
    }

    /**
     * getTargetAsLoaded - return the workflow object as loaded.
     *                    Use sparringly as this is resource intensive.
     *
     * @return {String}  The object prior to this transition.
     */
    getTargetAsLoaded() {
      return this.bridge.getRunAsScope().targetAsLoaded;
    }

    getSaves() {
        return this.toSave.slice();
    }

    getActionsToProcess() {
        return this.toProcessAction.slice();
    }

    getPublications() {
        return this.publications.slice();
    }

    getFetchRequests() {
        return this.fetchRequests.slice();
    }

    execute(request) {
        if (!request.execute) {
            throw new TypeError(`Request cannot be executed.
        Please check that this is actually a request.`);
        }
        return request.execute();
    }

    reset() {
        this.toSave = [];
        this.toProcessAction = [];
        this.publications = [];
        this.fetchRequests = [];
    }
}

HelpEntryBuilder.forAppXpress(__filename, 'PersistenceProvider').defer();

module.exports = PersistenceProvider;
