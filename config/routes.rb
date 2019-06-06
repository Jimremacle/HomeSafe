Rails.application.routes.draw do
  devise_for :users
  root to: 'reports#index'
  resources :emergency_contacts, only: :create

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :reports
  get 'search', to: 'reports#search'
end
