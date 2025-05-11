.. The WFits Project documentation master file, created by
   sphinx-quickstart on Tue Apr  8 12:46:37 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

The WFits Project Documentation
===============================

Add your content using ``reStructuredText`` syntax. See the
`reStructuredText <https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html>`_
documentation for details.

Overview
--------
Purpose
~~~~~~~
Project Overview
================

This project will develop an AI-powered virtual wardrobe / outfit recommendation application to assist users with their clothing selections on a daily basis. It will incorporate personal clothing information, user preferences, types of weather, and/or types of activities to create personalized outfit suggestions in a way that is both useful and fashionable to the user.

Key Features
============

Virtual Wardrobe Management
---------------------------

Users will upload pictures of their clothing, which will be stored in a digital wardrobe that they can search and filter. The user can have the system categorize their clothing and manually edit or add clothing items to help build a collection of their wardrobe.

Smart Outfit Suggestions
------------------------

The system will provide possible outfit choices based on clothing items from the user's wardrobe. The suggestions will dynamically adapt to:

- User preferences
- Weather (live API)
- Types of activities (e.g., gym, formal, casual)

Personalization & Feedback Loop
-------------------------------

The application will help tailor suggestions to the individual user by learning from their preferences and feedback. Users can like or dislike an outfit, as well as modify their personal preferences over time.

Multiple Options & Save Feature
-------------------------------

The system will provide multiple outfit suggestions with each request, allowing users to browse various choices and save their favourite outfits. Any saved outfits can be edited or deleted later.


System Requirements Mapping
----------------------------

- **Requirement 1**: Users should be able to upload photos of their clothes.
- **Sub-requirements**:

  - **1.1** The system shall allow users to upload photos.
  - **1.2** The system will store uploaded photos in a database with a unique identifier and reference to the user who uploaded it (virtual wardrobe).
  - **1.3** The system will support the upload of multiple photos at once.

- **Requirement 2**: The user should be able to categorise their clothing items.
- **Sub-requirements**:

  - **2.1** The system will allow users to categorise their clothing items using predefined categories and attributes.
  - **2.2** The system will automatically categorise clothing based on predefined categories and attributes.
  - **2.3** The system will allow users to manually edit the categorisation that was provided automatically.

- **Requirement 3**: The user should be provided with outfit recommendations.
- **Sub-requirements**:

  - **3.1** The system will provide outfit recommendations to the user based on clothing items stored in their virtual wardrobe.
  - **3.2** The outfit recommendations will be generated programmatically using the user’s uploaded items.
  - **3.3** The system will allow for new requests for outfit generations at any time.
  - **3.4** The system will present the outfit recommendation to the user in a way that showcases how it might look.
  - **3.5** The system shall allow users to give feedback as to whether they liked or disliked the recommended outfits.

- **Requirement 4**: The user’s outfit recommendations should relate to the user’s taste.
- **Sub-requirements**:

  - **4.1** The system shall collect and store user preferences.
  - **4.2** The system shall apply user preferences when generating outfit suggestions.
  - **4.3** The system will allow users to update or modify their stored preferences at any time.

- **Requirement 5**: The user should receive suggestions that take into account the weather.
- **Sub-requirements**:

  - **5.1** The system will integrate with weather APIs to fetch current and forecast weather data.
  - **5.2** The system will apply the weather conditions when generating outfit suggestions.
  - **5.3** The system shall allow users to view recommended outfits for different weather conditions.

- **Requirement 6**: The user should be able to view all items of clothing in their virtual wardrobe.
- **Sub-requirements**:

  - **6.1** The system will display all clothing items stored in the virtual wardrobe.
  - **6.2** The system shall allow users to filter clothing items by predefined categories and attributes.
  - **6.3** The system will allow users to search for specific items within their wardrobe.
  - **6.4** The system will allow users to remove items from their wardrobe if no longer needed.

- **Requirement 7**: The user should be provided with multiple options for outfits.
- **Sub-requirements**:

  - **7.1** The system shall provide at least three outfit options when generating recommendations.
  - **7.2** The system will allow the user to switch between the recommendations to choose the most suitable.
  - **7.3** The system will allow users to request more options if they don’t like any of the provided ones.

- **Requirement 8**: The user should be able to save previously suggested outfits.
- **Sub-requirements**:

  - **8.1** The system shall allow users to save outfits they like.
  - **8.2** The system will store saved outfits in the user’s profile for easy access.
  - **8.3** The system will allow users to delete or edit previously saved outfits.

- **Requirement 9**: The system should be secure.
- **Sub-requirements**:

  - **9.1** The system will employ secure communication between the client and server using HTTPS.
  - **9.2** The system will require user authentication before creating or accessing any kind of stored data.
  - **9.3** The system shall encrypt sensitive user data, including uploaded photos and personal information.

- **Requirement 10**: The system should provide outfit recommendations quickly.
- **Sub-requirements**:

  - **10.1** The system will return outfit recommendations within 5 seconds of a user request.
  - **10.2** The system shall optimise its recommendation algorithms to minimise latency.

- **Requirement 11**: The system should be reliable and robust.
- **Sub-requirements**:

  - **11.1** The system will maintain 99% uptime with minimal disruptions to services.
  - **11.2** The system shall implement error handling to prevent crashes.
  - **11.3** The system will automatically backup user data to avoid data loss.


Technology Stack
----------------

The following technologies and components are used to implement the Weather Clothing System, as shown in the System Architecture diagram:

- **Web Client UI**:
  
  - Built using **Next.js** (React Framework) for server-side rendering and enhanced performance.

- **Application Layer**:
  
  - **Node.js Server (Next.js BFF)**:
    
    - Acts as a Backend-for-Frontend (BFF) to manage communication between the UI and microservices.
    - Fetches weather data and processes user requests.

- **External Entities**:
  
  - **Weather API**:
    
    - An external service providing real-time and forecasted weather conditions.
  
  - **Identity Provider (IdP)**:
    
    - Used for secure user authentication and authorization.

- **Domain Entities**:
  
  - **OutfitGen Microservice**:
    
    - Responsible for generating outfit recommendations based on user wardrobe items, preferences, and weather data.

  - **ClothingProcessor Microservice**:
    
    - Manages clothing item uploads, categorization, and metadata storage.

- **Storage Systems**:
  
  - **Object Store**:
    
    - Stores images of clothing items uploaded by users.
  
  - **Database**:
    
    - Stores user profiles, wardrobes, saved outfits, preferences, and activity plans.

Architecture Integration
-------------------------

- The Node.js server communicates with the Weather API to retrieve weather data.
- Weather data is forwarded to the OutfitGen microservice.
- The OutfitGen microservice processes this information, along with user wardrobe data, to generate relevant outfit recommendations.
- The final outfits are returned to the Web Client UI for user display.

Data Flow
---------

1. The Node.js Server fetches current and forecasted weather data from the Weather API.
2. Weather data is parsed to extract essential parameters like temperature, precipitation, humidity, and wind.
3. The OutfitGen Microservice uses weather parameters to:
   
   - Select appropriate clothing items (e.g., jackets for cold weather, light clothing for warm days).
   - Recommend necessary accessories (e.g., umbrellas for rain, sunglasses for sunny conditions).
4. Recommended outfits are returned to the Web Client UI for display.

Functional and Non-Functional Requirements
------------------------------------------

- **Functional Requirements**:
  
  - Integration with external Weather APIs. (6.1)
  - Application of weather conditions in outfit generation. (6.2)
  - Presentation of weather-specific outfit recommendations. (6.3)

- **Non-Functional Requirements**:
  
  - Weather data updates at least every 30 minutes.
  - API call response times must be less than 2 seconds.
  - Secure API communications using HTTPS protocols.

Contents
--------

.. toctree::
   :maxdepth: 2
   :caption: Additional Documentation

   api
   setup
   testing
   glossary

Indices and Tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
