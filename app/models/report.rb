class Report < ApplicationRecord
  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  belongs_to :user

  INCIDENTS = ["Feeling", "Verbal", "Physical"]

  validates :report_type, presence: true
  validates :description, presence: true
  validates :occurence_timedate, presence: true
  validates :address, presence: true

end
