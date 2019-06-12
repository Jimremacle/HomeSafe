class ApplicationController < ActionController::Base
  #------------------------Cornel experimental start ---------------------------
  helper_method :resource_name, :resource, :devise_mapping, :resource_class
  #-------------------------Cornel experimental end ----------------------------


  protect_from_forgery with: :exception
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  skip_before_action :authenticate_user!, only: [:index, :search]
  include Pundit

  after_action :verify_authorized, except: [:index, :search], unless: :skip_pundit?
  after_action :verify_policy_scoped, only: [:index, :search], unless: :skip_pundit?

  def default_url_options
    { host: ENV["DOMAIN"] || "localhost:3000" }
  end


  #---------------------Cornel experimental start ------------------------------
  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
#---------------------Cornel experimental end ----------------------------------

 private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:account_update, keys: [:emergency_contact, :frequent_address, :encrypted_password])
  end

  def skip_pundit?
    devise_controller? || params[:controller] =~ /(^(rails_)?admin)|(^pages$)/  || params[:controller] =~ /(^emergency_contacts$)/
  end

end
