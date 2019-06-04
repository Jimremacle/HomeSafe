require 'faker'

Report.delete_all
User.delete_all

5.times do
  ename = Faker::Internet.email
  epass = Faker::Internet.password
  address = Faker::Address.street_address
  photo = Faker::Avatar.image("my-own-slug", "50x50")
  usercreated = User.create(email: ename, password: epass, frequent_address: address, avatar: photo)
  puts "Done Seeding..."
  @userId = usercreated.id
end

reports_attribute = [
  {
    report_type: "Verbal",
    description:"A man insulted me",
    longitude:4.3641,
    latitude:50.8454,
    occurence_timedate: "2019/06/05 20:50:00",
    address: "Cantersteen 10 Bruxelles",
    user_id: (@userId - 4)
  },
  {
    report_type: "Physical",
    description:"A man tried to take my hand",
    longitude:4.3641,
    latitude:50.8464,
    occurence_timedate: "2019-06-05 21:50:00",
    address: "Place de la Nation Bruxelles",
    user_id: (@userId - 4)
  },
  {
    report_type: "Physical",
    description:"A man chased me",
    longitude:4.4338,
    latitude:50.8167,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Avenue Roger Hainault Auderghem",
    user_id: (@userId - 3)
  },
  {
    report_type: "Verbal",
    description:"A man yelled at me",
    longitude:4.4038,
    latitude:50.8667,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Avenue des Loisirs 11 Evere",
    user_id: (@userId - 3)
  },
  {
    report_type: "Physical",
    description:"A man chased me",
    longitude:4.350585,
    latitude:50.844805,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Stalingrad Bruxelles",
    user_id: (@userId - 2)
  },
  {
    report_type: "Feeling",
    description:"Creepy neighborhood",
    longitude:4.344922,
    latitude:50.840470,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Marolles Bruxelles",
    user_id: (@userId - 2)
  },
  {
    report_type: "Feeling",
    description:"Bad neighborhood",
    longitude:4.344792,
    latitude:50.847377,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Rue Van Artevelde 55 Bruxelles",
    user_id: (@userId - 1)
  },
  {
    report_type: "Verbal",
    description:"A man wanted to sell me drugs",
    longitude:4.352064,
    latitude:50.852751,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Rue Vander Elst 17 Bruxelles",
    user_id: (@userId - 1)
  },
  {
    report_type: "Physical",
    description:"Saw a huge fight",
    longitude:4.369154,
    latitude:50.858768,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Place de la Reine Bruxelles",
    user_id: @userId
  },
  {
    report_type: "Feeling",
    description:"A man wanted to sell me drugs",
    longitude:4.363870,
    latitude:50.860309,
    occurence_timedate: "2019-06-06 21:50:00",
    address: "Rue de la Fraternité Schaerbeek",
    user_id: @userId
  }
]

Report.create!(reports_attribute)
puts "Done Seeding..."

