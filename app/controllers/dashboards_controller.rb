class DashboardsController < ApplicationController
  skip_after_action :verify_authorized, only: [:edit, :profile]
  def edit
    @usertoedit = current_user
    raise
  end

  def update
    current_user.update(user_params)
  end

  private

  def user_params
    params.require(:flat).permit(:email, :frequent_address, :avatar)
  end
end
