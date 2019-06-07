class ReportsController < ApplicationController
  before_action :set_reports, only: [:show, :edit, :update, :destroy]

  def index
    @reports = policy_scope(Report)
    start_search
    start_course_plotting

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
    @incidents = ["go home", "fill the mill", "Something else"]
  end

  def edit
  end

  def create
    @report = Report.new(report_params)
    # making link for nested element; select user in @report and setting
    # equal with the current user
    @report.user = current_user
    authorize @report

    if @report.save
      redirect_to root_path, notice: 'Report created successfully!'
    else
      render :new
    end
  end

  private

  def set_reports
    @report = Report.find(params[:id])
    authorize @report
  end

  def report_params
    params.require(:report).permit(:address, :description, :report_type, :occurence_timedate)
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

  def start_course_plotting
    if params[:query_start].present? && params[:query_end].present?
      @search_start = params[:query_start]
      @search_end = params[:query_end]
      # coords = MultiGeocoder.geocode(location)
      # params[:query] contains the address after the search


      # gem turns the address into coordinates
      results_start = Geocoder.search("#{params[:query_start]}")
      results_end = Geocoder.search("#{params[:query_end]}")
      @coordinates_start = [
        results_start.first.coordinates[0].to_s,
        results_start.first.coordinates[1].to_s
        ].join(",")

      @coordinates_end = [
        results_end.first.coordinates[0].to_s,
        results_end.first.coordinates[1].to_s
        ].join(",")

      # @latitude = results.first.coordinates[0]
      # @longitude = results.first.coordinates[1]
    else
      @search = "Brussels"
    end
  end

    # url = "https://geocoder.api.here.com/6.2/geocode.json?app_id=#{ENV['here_app_id']}&app_code=#{ENV['here_app_code']}&searchtext=#{@search}"
    # @here = JSON.load(open(url))

    # @latitude = @here.dig("Response", "View", 0, "Result", 0, "Location", "DisplayPosition", "Latitude" )
    # @longitude = @here.dig("Response", "View", 0, "Result", 0, "Location", "DisplayPosition", "Longitude" )
  end
end
