# Authoring Tool

The authoring tool was developed to ease content generation for Koconut. As of 08/20/18, the authoring tool supports
creation of new exercises, instructions and adding new concepts to the concept network.


## Getting admin permissions
To add yourself as an author on koconut, you need access to the Koconut's Firebase project titled 'Cyberlearning'.
After creating a learner account on Koconut, navigate to the `Authentication` tab and find your email address and the
corresponding your user uid. On the `Database` tab, expand the `Users` root and find the branch that corresponds to your
user uid.

It should look like the following image: <br/>
![Firebase User branch](https://i.imgur.com/Zinhkha.png)

Click on the plus sign to create a new branch under your user id (hover over user id to find the plus sign). Fill in the
fields with the following info.

Name: `permission` <br/>
Value: `"author"` <br/>

![Adding a new field to the user branch](https://i.imgur.com/xWu6mj3.png)

Click on `Add`. Your user branch should now look similar to the following image.

![New addition to the user branch](https://i.imgur.com/A3PRp85.png)

You should now see an additional link in the Koconut's hamburger menu.

![New link on Koconut](https://i.imgur.com/fTTn471.png)
