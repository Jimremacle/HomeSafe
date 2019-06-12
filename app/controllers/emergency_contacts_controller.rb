class EmergencyContactsController < ApplicationController
  def create
    coordinates = JSON.parse(params[:coords])
    current_location = Geocoder.search(coordinates).first.address
    EmergencyMessageService.new(current_user, current_location).call
    redirect_to reports_path(anchor: 'full')
    flash[:notice] = "sent message succesfully"
  end
end
