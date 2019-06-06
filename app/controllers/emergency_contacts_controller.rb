class EmergencyContactsController < ApplicationController
  def create
    EmergencyMessageService.new(current_user).call
  end
end
