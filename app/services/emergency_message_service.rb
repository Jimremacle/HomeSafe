class EmergencyMessageService
  def initialize(user, current_location = "Brussels")
    @user = user
    @current_location = current_location
    @client = Twilio::REST::Client.new(account_sid, auth_token)
  end

  def call
    user.emergency_contacts.each do |contact|
      @client.messages.create(
        from: from,
        to: contact.number,
        body: contact.message + " " + @current_location
      )
    end
  end

  private

  attr_reader :user, :client

  def account_sid
    ENV["twilio_account_sid"]
  end

  def auth_token
    ENV["twilio_auth_token"]
  end

  def from
    '+32460249174'
  end
end
