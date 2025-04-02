# internAtlas

internAtlas is a comprehensive platform designed to streamline the management of student attachments during university internships. The system enables students to register and update their attachment details—such as company information, location, supervisor details, and duration—directly through the platform. Leveraging geospatial data, internAtlas automatically assigns teachers to students based on proximity, ensuring that each teacher can effectively oversee and support a manageable group of students in their respective areas.

## Key Features

- **Student Registration & Management:**  
  - Students can sign up and register their attachment details.
  - Allows updates to attachment sites, supervisor contacts, and internship duration.
  
- **Geospatial Teacher Assignment:**  
  - Automatically assigns teachers to students based on the student's attachment location.
  - Uses geolocation queries to find the nearest teacher, optimizing oversight.

- **Dynamic Map Interface:**  
  - Teachers have access to a real-time map displaying the locations of their assigned students.
  - Enables tracking of student progress and location-based check-ins.

- **Logging & Reporting:**  
  - Facilitates logging of student check-ins, visits, and teacher-student interactions.
  - Provides an administrative dashboard for generating detailed reports and managing user accounts.

## Technologies Used

- **Backend:** Node.js with Express
- **Database:** MongoDB with geospatial indexing
- **Frontend:** React.js (or your preferred frontend framework)
- **Mapping:** Google Maps API or Leaflet.js for real-time location tracking

## System Architecture Overview

1. **Student Module:**  
   - Handles registration and attachment detail management.
   - Stores geolocation data for mapping purposes.

2. **Teacher Module:**  
   - Manages teacher profiles and assigned student lists.
   - Provides an interactive map for monitoring student locations.

3. **Admin Module:**  
   - Oversees overall system operations.
   - Manages users, reassigns teachers if necessary, and generates performance reports.

4. **Real-Time Data Handling:**  
   - Implements geospatial queries in MongoDB to enable proximity-based teacher assignment.
   - Integrates with mapping APIs for live tracking and visualization.

## Getting Started

### Prerequisites

- Node.js installed on your system
- MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)
- API key for Google Maps API or access to Leaflet.js if using open-source mapping

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/internAtlas.git
   cd internAtlas
