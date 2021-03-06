class ReportsController < ApplicationController
  before_action :set_reports, only: [:show, :edit, :update, :destroy]


  def index
    @reports = policy_scope(Report).where("created_at >= ?", Time.now - 604800000)
    start_search
    start_course_plotting

    @markers = @reports.map do |report|
      {
        lat: report.latitude,
        lng: report.longitude,
        infoWindow: render_to_string(partial: 'infowindow', locals: { report: report }),
        type: report.report_type
      }
    end
  end

  def show
  end

  def new
    @report = Report.new
    authorize @report

    if params[:coords] != nil
      coordinates = params[:coords].to_s.slice!(7, 34)
      coord_array = coordinates.split(" ")
      @longitude = coord_array[0].to_f
      @latitude =  coord_array[1].to_f
      @address = Geocoder.search([@latitude, @longitude]).first.address
      @report.address = @address
    end

  end

  def edit
  end

  def create
        if params[:report][:address] != nil
      coordinates = params[:report][:address].to_s.slice!(7, 34)
      coord_array = coordinates.split(" ")
      @longitude = coord_array[0].to_f
      @latitude =  coord_array[1].to_f
      @address = Geocoder.search([@latitude, @longitude]).first.address
      params[:report][:address] = @address
    end
    # raise
    @report = Report.new(report_params)
    # making link for nested element; select user in @report and setting
    # equal with the current user
    @report.user = current_user
    authorize @report

    if @report.save
      # 'Your comment', post_path(@comment.post) + "#comment_#{@comment.id.to_s}"
      redirect_to root_path(anchor: 'full'), notice: 'Report created successfully!'
      # redirect_to root_path, notice: 'Report created successfully!'
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
      # respond_to do |format|
      #   format.html { redirect_to reports_path }
      #   format.js
      # end
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
