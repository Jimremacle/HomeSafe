class EmergencyContactsController < ApplicationController
  def create
    EmergencyMessageService.new.call
  end
end
