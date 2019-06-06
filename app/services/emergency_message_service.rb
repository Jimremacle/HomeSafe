class EmergencyMessageService
  def initialize(attributes = {})
    @account_sid = ENV["twilio_account_sid"]
    @auth_token = ENV["twilio_auth_token"]
    @client = Twilio::REST::Client.new(@account_sid, @auth_token)
    @from = '+32460249174'
    @to_number = '+32477412919' || attributes[:to_number]
  end

  def call
    @client.messages.create(
      from: @from,
      to: @to_number,
      body: "HELP Im BEING ATTACKED!"
    )
  end
end
