class ReportsController < ApplicationController
  before_action :set_reports, only: [:show, :edit, :update, :destroy]

  def index
    @reports = policy_scope(Report)
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
end
