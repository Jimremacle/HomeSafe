class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [:index, :search]
  include Pundit

  after_action :verify_authorized, except: [:index, :search], unless: :skip_pundit?
  after_action :verify_policy_scoped, only: [:index, :search], unless: :skip_pundit?

  private

  def skip_pundit?
    devise_controller? || params[:controller] =~ /(^(rails_)?admin)|(^pages$)/  || params[:controller] =~ /(^emergency_contacts$)/
  end
end
