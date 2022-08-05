/**
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
'use strict';
(function (factory, window) {
    /*globals define, module, require*/

    // define an AMD module that relies on 'TIMAAT'
    if (typeof define === 'function' && define.amd) {
        define(['TIMAAT'], factory);


    // define a Common JS module that relies on 'TIMAAT'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('TIMAAT'));
    }

    // attach your plugin to the global 'TIMAAT' variable
    if(typeof window !== 'undefined' && window.TIMAAT){
        factory(window.TIMAAT);
    }

}(function (TIMAAT) {

	TIMAAT.UserSettings = {

		init: function() {
      this.initSettings();
		},

		initSettings: function() {
      $('#userSettings').on('click', function(event) {
        if (TIMAAT.Service.session && TIMAAT.Service.session.displayName == 'Gast Account') { //* Do not allow changes to gast-account used on demo-server
            let modal = $('#userSettingsModal');
            modal.find('.modal-header').html(`
              <h5 class="modal-title">User settings</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
            `);
            modal.find('.modal-body').html(`
              There are no settings available for the guest account.
            `);
            modal.find('.modal-footer').html(`
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            `);
            modal.modal('show');
        } else {
          changeUserPasswordValidator.resetForm();
          let modal = $('#userSettingsModal');
          modal.modal('show');
        }
      });

      $('#userSettingsChangePasswordSubmitButton').on('click', async function (event) {
        event.preventDefault();
        if (!$('#changeUserPassword').valid())
          return;
        let currentPassword = $('#currentPassword').val();
        let username = await TIMAAT.Service.getUserAccountNameByDisplayName(TIMAAT.Service.session.displayName);
        let oldHash = TIMAAT.Util.getArgonHash(currentPassword, username + TIMAAT.Service.clientSalt);
        let credentials = {
          username : username,
          password: oldHash,
          newPassword: null
        }
        let currentPasswordIsValid = await TIMAAT.UserService.isPasswordValid(credentials);
        if (currentPasswordIsValid) {
          let newPassword = $('#newPassword').val();
          let newHash = TIMAAT.Util.getArgonHash(newPassword, username + TIMAAT.Service.clientSalt);
          if (currentPassword == newPassword) {
            $('#newPassword').after('<label id="newPasswordError" class="error" for="newPassword">Your new password cannot be the same as your old one</label>');
            return;
          } else {
            let newCredentials = {
              username: username,
              password: oldHash,
              newPassword: newHash
            };
            await TIMAAT.UserService.changePassword(newCredentials);
            $('#changeUserPassword').trigger('reset');
            $('#userSettingsModal').modal('hide');
            let modal = $('#passwordChanged');
            modal.modal('show');
          }
        } else {
          $('#currentPassword').after('<label id="currentPasswordError" class="error" for="currentPassword">Please enter your current password</label>');
          return;
        }
      });

      $('#userSettingsModal').on('hidden.bs.modal', function(event) {
        $('#changeUserPassword').trigger('reset');
      });

    },

	}

}, window));
