class ReportsController < ApplicationController
  before_action :set_reports, only: [:show, :edit, :update, :destroy]

  def index
    @reports = policy_scope(Report)
    start_search

    @markers = @reports.map do |report|
      {
        lat: report.latitude,
        lng: report.longitude,
        infoWindow: render_to_string(partial: 'infowindow', locals: { report: report })
      }
    end
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
      # coords = MultiGeocoder.geocode(location)
      # params[:query] contains the address after the search


      # gem turns the address into coordinates
      results = Geocoder.search("#{params[:query]}")
      @geolocation_marker = [
        results.first.coordinates[0].to_s,
        results.first.coordinates[1].to_s
        ].join(",")


      # @latitude = results.first.coordinates[0]
      # @longitude = results.first.coordinates[1]
    else
      @search = "Brussels"
    end

    # url = "https://geocoder.api.here.com/6.2/geocode.json?app_id=#{ENV['here_app_id']}&app_code=#{ENV['here_app_code']}&searchtext=#{@search}"
    # @here = JSON.load(open(url))

    # @latitude = @here.dig("Response", "View", 0, "Result", 0, "Location", "DisplayPosition", "Latitude" )
    # @longitude = @here.dig("Response", "View", 0, "Result", 0, "Location", "DisplayPosition", "Longitude" )
  end
end
