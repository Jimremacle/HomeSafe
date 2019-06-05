require 'geokit'
include Geokit::Geocoders

class ReportsController < ApplicationController
  before_action :set_reports, only: [:show, :edit, :update, :destroy]

  def index
    @reports = policy_scope(Report)
    start_search
  end

  def show
  end

  def new
    @report = Report.new
    authorize @report
  end

  def edit
  end

  def create
    @report = report.new(report_params)
    @report.user = current_user
    authorize @report

    if @report.save
      redirect_to @report, notice: 'Report created successfully!'
    else
      render :new
    end
  end

  private

  def set_reports
    @report = Report.find(params[:id])
    authorize @report
  end

  def start_search
    if params[:query].present?
      @search = params[:query]
      coords = MultiGeocoder.geocode(location)
      @longitude = coords.lat
      @latitude = coords.lng
    else
      @search = "Brussels"
    end







    # url = "https://geocoder.api.here.com/6.2/geocode.json?app_id=#{ENV['here_app_id']}&app_code=#{ENV['here_app_code']}&searchtext=#{@search}"
    # @here = JSON.load(open(url))

    # @latitude = @here.dig("Response", "View", 0, "Result", 0, "Location", "DisplayPosition", "Latitude" )
    # @longitude = @here.dig("Response", "View", 0, "Result", 0, "Location", "DisplayPosition", "Longitude" )
  end

end
