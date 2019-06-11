class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  after_create :initialize_emergency_contact

  has_many :reports
  has_many :emergency_contacts

  private

  def initialize_emergency_contact
    EmergencyContact.create(user: self)
  end
end
